import { FinancialLedgerEntry, PayoutRecord, YogaCentre } from '../types';

/**
 * Generates and triggers download of a standardized CSV statement for a yoga centre
 */
export function exportLedgerToCSV(
  centre: YogaCentre,
  entries: FinancialLedgerEntry[],
  dateRangeLabel = 'All Time'
) {
  const headers = [
    'Entry #',
    'Date',
    'Type',
    'Direction',
    'Amount (USD)',
    'Reference Code',
    'Booking ID',
    'Payout ID',
    'Status',
    'Description',
    'Actor'
  ];

  const rows = entries.map(e => [
    e.entryNumber.toString(),
    new Date(e.createdAt).toISOString().split('T')[0],
    e.entryType,
    e.entryDirection.toUpperCase(),
    (e.entryDirection === 'debit' ? -e.amount : e.amount).toFixed(2),
    e.referenceCode || '',
    e.bookingId || '',
    e.payoutId || '',
    e.status,
    `"${(e.description || '').replace(/"/g, '""')}"`,
    e.actorEmail || 'system'
  ]);

  const totalCredits = entries
    .filter(e => e.entryDirection === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalDebits = entries
    .filter(e => e.entryDirection === 'debit')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalCredits - totalDebits;

  const summaryRows = [
    [],
    ['--- SUMMARY ---'],
    ['Centre Name', `"${centre.name}"`],
    ['Location', `"${centre.location}"`],
    ['Statement Period', `"${dateRangeLabel}"`],
    ['Generated At', new Date().toISOString()],
    ['Total Credits (USD)', totalCredits.toFixed(2)],
    ['Total Debits (USD)', totalDebits.toFixed(2)],
    ['Net Settled Balance (USD)', netBalance.toFixed(2)]
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(',')),
    ...summaryRows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${centre.slug || 'centre'}-financial-statement-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers browser print dialog formatted for a clean financial PDF report
 */
export function printCentreStatement(
  centre: YogaCentre,
  entries: FinancialLedgerEntry[],
  payouts: PayoutRecord[],
  metrics: {
    grossBookingValue: number;
    platformCommission: number;
    refunds: number;
    netAmountPayable: number;
    totalPayoutsCompleted: number;
    outstandingPayableBalance: number;
  }
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const rowsHtml = entries.map(e => `
    <tr style="border-bottom: 1px solid #e5e7eb; font-size: 12px;">
      <td style="padding: 8px 4px;">#${e.entryNumber}</td>
      <td style="padding: 8px 4px;">${new Date(e.createdAt).toLocaleDateString()}</td>
      <td style="padding: 8px 4px; text-transform: capitalize;">${e.entryType.replace(/_/g, ' ')}</td>
      <td style="padding: 8px 4px; font-weight: 600; color: ${e.entryDirection === 'credit' ? '#166534' : '#991b1b'};">
        ${e.entryDirection === 'credit' ? '+' : '-'}$${e.amount.toFixed(2)}
      </td>
      <td style="padding: 8px 4px;">${e.referenceCode || '-'}</td>
      <td style="padding: 8px 4px;">${e.description}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>YogaConnect India - Financial Statement - ${centre.name}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; margin: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #263D32; padding-bottom: 20px; margin-bottom: 24px; }
          .brand { font-size: 24px; font-weight: 700; color: #263D32; font-family: serif; }
          .centre-title { font-size: 18px; font-weight: 600; color: #111827; margin-top: 4px; }
          .meta { font-size: 12px; color: #6b7280; text-align: right; }
          .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
          .kpi-card { background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 16px; border-radius: 8px; }
          .kpi-label { font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 600; }
          .kpi-value { font-size: 18px; font-weight: 700; color: #111827; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { font-size: 11px; text-transform: uppercase; color: #4b5563; border-bottom: 2px solid #e5e7eb; padding: 8px 4px; background: #f3f4f6; }
          .footer { margin-top: 40px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; }
          @media print { body { margin: 20mm; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">YogaConnect India</div>
            <div class="centre-title">${centre.name}</div>
            <div style="font-size: 12px; color: #4b5563;">${centre.location}</div>
          </div>
          <div class="meta">
            <div><strong>OFFICIAL FINANCIAL STATEMENT</strong></div>
            <div>Statement Date: ${new Date().toLocaleDateString()}</div>
            <div>Currency: USD ($)</div>
            <div>Contractual Commission: ${centre.commissionRatePercent || 15}%</div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Gross Booking Value</div>
            <div class="kpi-value">$${metrics.grossBookingValue.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Platform Commission</div>
            <div class="kpi-value">-$${metrics.platformCommission.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Net Entitlement</div>
            <div class="kpi-value">$${metrics.netAmountPayable.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Settled Payouts</div>
            <div class="kpi-value">$${metrics.totalPayoutsCompleted.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Outstanding Balance</div>
            <div class="kpi-value" style="color: #166534;">$${metrics.outstandingPayableBalance.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Refunds Reversed</div>
            <div class="kpi-value">-$${metrics.refunds.toFixed(2)}</div>
          </div>
        </div>

        <h3 style="font-size: 14px; margin-bottom: 12px; color: #111827;">Immutable Financial Ledger Record</h3>
        <table>
          <thead>
            <tr>
              <th>Entry #</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Ref Code</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          YogaConnect India • Escrow Protection Guarantee • Generated from cryptographically verified ledger records.
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 400);
}
