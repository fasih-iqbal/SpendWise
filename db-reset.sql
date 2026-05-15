-- ============================================================
-- SpendWise — Full Database Reset (Users + Data) + Default Categories
-- Run in: Supabase Dashboard → SQL Editor
--
-- ⚠️  This wipes EVERY user, every expense, every budget, every goal.
--     Schema, RLS policies and triggers stay intact.
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. WIPE all user data + all auth users
--    Deleting from auth.users cascades into profiles → all
--    downstream rows via the existing ON DELETE CASCADE FKs.
--    The explicit TRUNCATEs after that are a belt-and-braces
--    sweep in case any orphaned rows remain.
-- ──────────────────────────────────────────────────────────
DELETE FROM auth.users;

TRUNCATE TABLE expenses   CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE budgets    CASCADE;
TRUNCATE TABLE goals      CASCADE;
TRUNCATE TABLE profiles   CASCADE;

-- ──────────────────────────────────────────────────────────
-- 2. DEFAULT CATEGORIES seed table
--    Single source of truth — used to seed every new signup.
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS default_categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  emoji      TEXT NOT NULL,
  color      TEXT NOT NULL,
  sort_order INT  DEFAULT 0
);

TRUNCATE TABLE default_categories RESTART IDENTITY;

INSERT INTO default_categories (name, emoji, color, sort_order) VALUES
  ('Rent',              '🏠', '#6B7FD7', 1),
  ('Utilities',         '💡', '#F5A623', 2),
  ('Groceries',         '🛒', '#4CAF82', 3),
  ('Restaurants',       '🍽️', '#E87D4A', 4),
  ('Transportation',    '🚌', '#5B9BD5', 5),
  ('Fuel',              '⛽', '#E84B4B', 6),
  ('Shopping',          '🛍️', '#C97BC9', 7),
  ('Entertainment',     '🎬', '#FF6B9D', 8),
  ('Healthcare',        '🏥', '#4DB6AC', 9),
  ('Insurance',         '🛡️', '#7986CB', 10),
  ('Education',         '📚', '#26A69A', 11),
  ('Subscriptions',     '📱', '#AB47BC', 12),
  ('Travel',            '✈️', '#29B6F6', 13),
  ('Fitness',           '🏋️', '#66BB6A', 14),
  ('Personal Care',     '💆', '#F48FB1', 15),
  ('Family',            '👨‍👩‍👧', '#FF7043', 16),
  ('Pets',              '🐾', '#8D6E63', 17),
  ('Bills',             '📄', '#78909C', 18),
  ('Savings',           '💰', '#C9A830', 19),
  ('Investments',       '📈', '#2C6A49', 20),
  ('Taxes',             '🧾', '#D07850', 21),
  ('Gifts',             '🎁', '#EC407A', 22),
  ('Donations',         '🤝', '#42A5F5', 23),
  ('Business Expenses', '💼', '#546E7A', 24),
  ('Electronics',       '🖥️', '#5C6BC0', 25),
  ('Gadgets',           '🎮', '#26C6DA', 26),
  ('Clothing',          '👔', '#EF5350', 27),
  ('Miscellaneous',     '📦', '#BDBDBD', 28);

-- ──────────────────────────────────────────────────────────
-- 3. TRIGGER — auto-seed default categories on new sign-up
--    Fires when a row appears in profiles (which itself is
--    created by your existing handle_new_user() trigger on
--    auth.users insert).
-- ──────────────────────────────────────────────────────────
DROP TRIGGER  IF EXISTS trg_seed_default_categories ON profiles;
DROP FUNCTION IF EXISTS fn_seed_default_categories();

CREATE OR REPLACE FUNCTION fn_seed_default_categories()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO categories (user_id, name, emoji, color, budget_limit)
  SELECT NEW.id, d.name, d.emoji, d.color, 0
    FROM default_categories d
   ORDER BY d.sort_order;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_seed_default_categories
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION fn_seed_default_categories();

-- ──────────────────────────────────────────────────────────
-- 4. VERIFY
-- ──────────────────────────────────────────────────────────
SELECT 'auth users remaining: '         || COUNT(*) FROM auth.users;
SELECT 'profiles remaining: '           || COUNT(*) FROM profiles;
SELECT 'expenses remaining: '           || COUNT(*) FROM expenses;
SELECT 'categories remaining: '         || COUNT(*) FROM categories;
SELECT 'budgets remaining: '            || COUNT(*) FROM budgets;
SELECT 'goals remaining: '              || COUNT(*) FROM goals;
SELECT 'default_categories seeded: '    || COUNT(*) FROM default_categories;
