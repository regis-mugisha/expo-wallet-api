import express from "express";
import {
  createTransaction,
  deleteTransactionById,
  getTransactionsByUserId,
  getTransactionsSummaryByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransactionById);

router.get("/summary/:userId", getTransactionsSummaryByUserId);

export default router;
