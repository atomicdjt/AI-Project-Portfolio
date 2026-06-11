import { AlertTriangle, Link2, MessageSquareText, WalletCards } from 'lucide-react'
import { findSensitiveDataWarnings } from '../../lib/extractEntities'
import { useCaseStore } from '../../store/useCaseStore'
import { FileUploader } from './FileUploader'

export function EvidenceInput() {
  const caseData = useCaseStore((state) => state.caseData)
  const updateCase = useCaseStore((state) => state.updateCase)
  const warningText = [caseData.evidenceText, caseData.manualExtractedText].join('\n')
  const sensitiveWarnings = findSensitiveDataWarnings(warningText)

  return (
    <div className="evidence-stack">
      <div className="subsection-heading">
        <MessageSquareText size={21} aria-hidden="true" />
        <div><h3>Suspicious content</h3><p>Paste the message exactly as received, after removing highly sensitive values.</p></div>
      </div>
      <label className="field field-full">
        <span>Paste email, text, chat, invoice, or payment instructions</span>
        <textarea
          rows={8}
          value={caseData.evidenceText}
          onChange={(event) => updateCase({ evidenceText: event.target.value })}
          placeholder="Example: URGENT: Your account is locked. Verify within 24 hours..."
        />
      </label>
      {sensitiveWarnings.length > 0 && (
        <div className="sensitive-warning" role="alert">
          <AlertTriangle size={21} aria-hidden="true" />
          <div><strong>Remove sensitive information before continuing</strong>{sensitiveWarnings.map((warning) => <p key={warning.type}>{warning.message}</p>)}</div>
        </div>
      )}

      <FileUploader />

      <label className="field field-full">
        <span>Text visible in the image or document <small>(manual entry if needed)</small></span>
        <textarea
          rows={4}
          value={caseData.manualExtractedText}
          onChange={(event) => updateCase({ manualExtractedText: event.target.value })}
          placeholder="Type or correct the important wording shown in the screenshot."
        />
      </label>

      <div className="subsection-heading compact">
        <Link2 size={21} aria-hidden="true" />
        <div><h3>Link and contact details</h3><p>Enter text only. ScamShield never opens or crawls a suspicious website.</p></div>
      </div>
      <div className="safe-link-warning"><AlertTriangle size={18} aria-hidden="true" /><strong>Do not click suspicious links.</strong> Verify by typing the official website yourself.</div>
      <div className="form-grid">
        <label className="field">
          <span>Suspicious URL text</span>
          <input type="text" inputMode="url" value={caseData.suspiciousUrl} onChange={(event) => updateCase({ suspiciousUrl: event.target.value })} placeholder="example-login.test" />
        </label>
        <label className="field">
          <span>Claimed company or person</span>
          <input type="text" value={caseData.claimedCompany} onChange={(event) => updateCase({ claimedCompany: event.target.value })} placeholder="Company, agency, or person's name" />
        </label>
        <label className="field">
          <span>Phone number or email involved</span>
          <input type="text" value={caseData.contactDetails} onChange={(event) => updateCase({ contactDetails: event.target.value })} placeholder="Keep only what is needed as evidence" />
        </label>
        <label className="field">
          <span>Deadline or pressure language</span>
          <input type="text" value={caseData.pressureLanguage} onChange={(event) => updateCase({ pressureLanguage: event.target.value })} placeholder="Within 24 hours, final notice..." />
        </label>
      </div>

      <div className="subsection-heading compact">
        <WalletCards size={21} aria-hidden="true" />
        <div><h3>Payment request</h3><p>Document the request. Do not send money as part of this process.</p></div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Payment destination or method</span>
          <input type="text" value={caseData.paymentDestination} onChange={(event) => updateCase({ paymentDestination: event.target.value })} placeholder="Gift card, wallet, wire instructions..." />
        </label>
        <label className="field">
          <span>Amount requested</span>
          <input type="text" inputMode="decimal" value={caseData.amountRequested} onChange={(event) => updateCase({ amountRequested: event.target.value })} placeholder="$0.00" />
        </label>
      </div>
    </div>
  )
}
