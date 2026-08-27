"use client";

import { useReducer } from "react";

export type TransactionStatus = "idle" | "pending" | "signing" | "submitting" | "success" | "failed";

export interface TransactionState {
  status: TransactionStatus;
  txHash: string | null;
  error: string | null;
}

export const initialTransactionState: TransactionState = {
  status: "idle",
  txHash: null,
  error: null,
};

export type TransactionAction =
  | { type: "STATUS"; status: Exclude<TransactionStatus, "success" | "failed"> }
  | { type: "SUCCESS"; txHash: string }
  | { type: "FAILED"; error: string }
  | { type: "RESET" };

export function transactionStatusReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case "STATUS":
      return { ...state, status: action.status, txHash: null, error: null };
    case "SUCCESS":
      return { status: "success", txHash: action.txHash, error: null };
    case "FAILED":
      return { ...state, status: "failed", error: action.error };
    case "RESET":
      return initialTransactionState;
    default:
      return state;
  }
}

export function useTransactionStatus(options?: { onStatus?: (status: TransactionStatus) => void }) {
  const [state, dispatch] = useReducer(transactionStatusReducer, initialTransactionState);

  const dispatchWithCallback = (
    action: TransactionAction,
    status?: TransactionStatus
  ) => {
    dispatch(action);
    if (status) options?.onStatus?.(status);
  };

  return {
    ...state,
    isInProgress: ["pending", "signing", "submitting"].includes(state.status),
    start: () => dispatchWithCallback({ type: "STATUS", status: "pending" }, "pending"),
    setStatus: (status: Exclude<TransactionStatus, "idle" | "success" | "failed">) =>
      dispatchWithCallback({ type: "STATUS", status }, status),
    succeed: (txHash: string) => dispatchWithCallback({ type: "SUCCESS", txHash }, "success"),
    fail: (error: string) => dispatchWithCallback({ type: "FAILED", error }, "failed"),
    reset: () => dispatch({ type: "RESET" }),
  };
}
