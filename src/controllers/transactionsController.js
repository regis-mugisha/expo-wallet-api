import { sql } from "../config/db.js";
export const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;
    console.log("Transactions retrieved:", transactions);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !amount || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *
    `;
    console.log("Transaction created:", transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`
                DELETE FROM transactions WHERE id = ${id} RETURNING *
            `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    console.log("Transaction deleted:", result[0]);
    res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (error) {
    console.log("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getTransactionsSummaryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
            SELECT COALESCE(SUM(amount)) AS balance FROM transactions WHERE user_id = ${userId}
        `;

    const incomeResult = await sql`
            SELECT COALESCE(SUM(amount)) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `;
    const expenseResult = await sql`
            SELECT COALESCE(SUM(amount)) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.error("Error retrieving transaction summary:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
