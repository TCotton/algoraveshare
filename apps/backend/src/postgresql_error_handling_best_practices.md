# PostgreSQL Error Handling Best Practices

## Key Best Practices

1. **Keep Transactions Short and Focused**
   - Avoid long-lived transactions due to locking and contention.
   - Only wrap what needs atomicity in a transaction.

2. **Use Savepoints / Subtransactions for Granular Rollback**
   - Use `SAVEPOINT` and `ROLLBACK TO SAVEPOINT` to partially rollback.
   - In PL/pgSQL, `EXCEPTION` blocks implicitly create a savepoint.
   - Avoid excessive nesting to prevent performance overhead.

3. **Use Exception Handling in PL/pgSQL**
   - Use `BEGIN … EXCEPTION … END` blocks for risky operations.
   - Catch specific errors like `UNIQUE_VIOLATION` instead of `WHEN OTHERS`.
   - Leverage `SQLSTATE` and `SQLERRM` for detailed diagnostics.
   - Use `RAISE` with context when rethrowing.

4. **Log Errors Appropriately**
   - Use `RAISE LOG` or `RAISE NOTICE` to log diagnostic details.
   - Consider separate logging channels or audit tables if rollback would remove logs.

5. **Be Careful with Nested Transactions**
   - Subtransactions are powerful but costly — use when meaningful.

6. **Design for Retry / Idempotency**
   - Handle transient errors (deadlocks, serialization failures) with retries.
   - Make operations idempotent or detect/avoid duplicates.

7. **Avoid Business Logic & External Calls Inside Transactions**
   - Avoid outbound HTTP calls, mail sending, and heavy computation within transactions.

8. **Fail Fast & Validate Early**
   - Validate inputs in the application layer before reaching the database.
   - Enforce business rules using constraints where reasonable.

9. **Use Proper Isolation Levels**
   - Select the appropriate isolation level based on consistency requirements.
   - Understand which errors arise under different isolation modes.

10. **Test Error Paths**
   - Simulate constraint failures, deadlocks, and serialization anomalies in testing.

---

## Common Pitfalls

- **Implicit Subtransactions Overhead**
- **Logging in Transactions That May Roll Back**
- **Not Rolling Back After Errors in Client Code**
- **Excessive Savepoint Usage**
- **Attempting COMMIT Inside a Subtransaction**

---

## Example Pattern (PL/pgSQL)

```sql
CREATE OR REPLACE FUNCTION process_order(order_id INT) RETURNS VOID AS $$
BEGIN
  INSERT INTO order_log(order_id, status) VALUES (order_id, 'started');

  BEGIN
    PERFORM charge_customer(order_id);
    PERFORM reserve_inventory(order_id);
  EXCEPTION
    WHEN unique_violation THEN
      RAISE LOG 'Order %: unique violation on reserve_inventory', order_id;
      RAISE;
    WHEN foreign_key_violation THEN
      RAISE LOG 'Order %: bad fk error', order_id;
      RAISE;
    WHEN OTHERS THEN
      RAISE LOG 'Order %: unexpected error %, %', order_id, SQLSTATE, SQLERRM;
      RAISE;
  END;

  INSERT INTO order_log(order_id, status) VALUES (order_id, 'completed');

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Processing order % failed: % / %', order_id, SQLSTATE, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql;
```

---

## Summary

- Favor short, focused transactions
- Use savepoints wisely
- Employ structured exception handling
- Log intelligently
- Build retry‑friendly and idempotent workflows
- Test failure scenarios thoroughly
