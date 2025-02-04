import { a } from '@aws-amplify/backend'

export const Financials = a.customType({
  // Required fields
  financialsId: a.string().required(),
  supplierId: a.string(),
  buyerId: a.string(),
  investorId: a.string(),
  brokerId: a.string(),
  spvId: a.string(),
  identityId: a.string(),

  // Document attachments
  financials_attachment: a.string(),
  balance_sheet_attachment: a.string(),
  income_statement_attachment: a.string(),

  // Asset information
  current_assets: a.string(),
  cash_flow: a.string(),
  cash_flow_from_operating_activities: a.string(),
  cash_flow_from_operating_activities_risk: a.string(),

  // Debt and liabilities
  current_long_term_debt: a.string(),
  current_liabilities: a.string(),

  // Financial metrics
  gross_margin: a.string(),
  operating_income: a.string(),
  other_expenses: a.string(),
  ebt: a.string(),
  ebitda: a.string(),

  // Financial ratios and risks
  current_ratio: a.string(),
  current_ratio_risk: a.string(),
  debt_equity_ratio: a.string(),
  debt_ebitda_ratio: a.string(),

  // Inventory metrics
  inventory_turnover: a.string(),
  inventory_turnover_risk: a.string(),
  inventory_turnover_trend: a.string(),
  inventory_turnover_trend_risk: a.string(),
  inventory_cost_of_goods_sold_ratio: a.string(),
  inventory_cost_of_goods_sold_ratio_risk: a.string(),
  inventory_buyer_transaction_amount_ratio: a.string(),
  inventory_buyer_transaction_amount_ratio_risk: a.string(),

  // Interest and coverage
  interest_coverage: a.string(),
  interest_coverage_risk: a.string(),

  // Tax and expenses
  income_tax_expense: a.string(),

  // Balance sheet items
  total_liabilities_and_equity: a.string(),
  cash: a.string(),
  marketable_securities: a.string(),
  accounts_receivable: a.string(),
  inventory: a.string(),
  inventory_beginning: a.string(),
  inventory_end: a.string(),
  property: a.string(),
  goodwill: a.string(),
  other_current_assets: a.string(),
  other_non_current_assets: a.string(),
  accumulated_depreciation: a.string(),
  net_operating_loss: a.string(),
  total_assets: a.string(),

  // Liabilities detail
  short_term_debt: a.string(),
  accounts_payable: a.string(),
  accured_expenses: a.string(),
  unearned_revenue: a.string(),
  long_term_debt: a.string(),
  other_current_liabilities: a.string(),
  other_long_term_liabilities: a.string(),
  income_tax_payable: a.string(),
  dividends_payable: a.string(),
  total_liabilities: a.string(),

  // Equity components
  common_stock: a.string(),
  preferred_stock: a.string(),
  paid_in_capital: a.string(),
  retained_earnings: a.string(),
  total_equity: a.string(),
  equity_book_value: a.string(),
  equity_market_value: a.string(),
  equity_net_operating_loss_ratio: a.string(),
  equity_net_operating_loss_ratio_risk: a.string(),

  // Income statement items
  sales: a.string(),
  sales_risk: a.string(),
  cost_of_goods_sold: a.string(),
  operating_expenses: a.string(),
  marketing_expenses: a.string(),
  bad_debt_expenses: a.string(),

  // Timestamps and status
  createdAt: a.string(),

  // Additional financial metrics
  ebit: a.string(),
  interest_expenses: a.string(),
  depreciation_expenses: a.string(),
  sale_purchase_of_fixed_asset: a.string(),
  extraordinary_income: a.string(),
  tax_expenses: a.string(),

  // Profit metrics
  net_profit: a.string(),
  net_profit_risk: a.string(),
  net_profit_previous_year: a.string(),

  // Rating and status
  financials_rating: a.string(),
  financials_reporting_period: a.string(),
  working_capital: a.string(),
  financials_status: a.string(),
  financials_status_risk: a.string(),
  financials_denomination: a.string(),

  // User info and sorting
  userId: a.string().required(),
  sortkey: a.string()
})
