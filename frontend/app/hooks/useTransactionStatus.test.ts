import { describe, expect, it } from "vitest";
import { initialTransactionState, transactionStatusReducer } from "./useTransactionStatus";
import { act, renderHook } from "@testing-library/react";
import { useTransactionStatus } from "./useTransactionStatus";

describe("transactionStatusReducer", () => {
  it("moves from idle through signing and submission to success", () => {
    const pending = transactionStatusReducer(initialTransactionState, {
      type: "STATUS",
      status: "pending",
    });
    const signing = transactionStatusReducer(pending, { type: "STATUS", status: "signing" });
    const submitting = transactionStatusReducer(signing, { type: "STATUS", status: "submitting" });
    const success = transactionStatusReducer(submitting, {
      type: "SUCCESS",
      txHash: "abc123",
    });

    expect(pending.status).toBe("pending");
    expect(signing.status).toBe("signing");
    expect(submitting.status).toBe("submitting");
    expect(success).toEqual({ status: "success", txHash: "abc123", error: null });
  });

  it("captures a recoverable failure", () => {
    const signing = transactionStatusReducer(initialTransactionState, {
      type: "STATUS",
      status: "signing",
    });
    const failed = transactionStatusReducer(signing, {
      type: "FAILED",
      error: "Transaction rejected by wallet. Please try again.",
    });

    expect(failed.status).toBe("failed");
    expect(failed.error).toBe("Transaction rejected by wallet. Please try again.");
  });

  it("resets terminal states for another transaction", () => {
    const failed = transactionStatusReducer(initialTransactionState, {
      type: "FAILED",
      error: "Insufficient balance to submit this transaction.",
    });

    expect(transactionStatusReducer(failed, { type: "RESET" })).toEqual(initialTransactionState);
  });
});

describe("useTransactionStatus lifecycle callbacks", () => {
  it("fires onStatus callbacks in correct sequence: pending -> signing -> submitting -> success", async () => {
    const statusSequence: string[] = [];
    const { result } = renderHook(() =>
      useTransactionStatus({ onStatus: (s) => statusSequence.push(s) })
    );

    act(() => {
      result.current.start();
    });
    expect(statusSequence).toEqual(["pending"]);

    act(() => {
      result.current.setStatus("signing");
    });
    expect(statusSequence).toEqual(["pending", "signing"]);

    act(() => {
      result.current.setStatus("submitting");
    });
    expect(statusSequence).toEqual(["pending", "signing", "submitting"]);

    act(() => {
      result.current.succeed("abc123");
    });
    expect(statusSequence).toEqual(["pending", "signing", "submitting", "success"]);
  });

  it("calls onStatus with failed status when fail is called", () => {
    const statusSequence: string[] = [];
    const { result } = renderHook(() =>
      useTransactionStatus({ onStatus: (s) => statusSequence.push(s) })
    );

    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.fail("Transaction rejected by wallet");
    });

    expect(statusSequence).toEqual(["pending", "failed"]);
  });
});
