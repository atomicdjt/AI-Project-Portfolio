import { ArrowRight, HeartHandshake, Info, Siren } from 'lucide-react'
import { useState } from 'react'
import { useCaseStore } from '../../store/useCaseStore'
import { SectionCard } from '../layout/SectionCard'
import { EvidenceInput } from './EvidenceInput'

export function CaseIntakeForm() {
  const caseData = useCaseStore((state) => state.caseData)
  const caregiverMode = useCaseStore((state) => state.caregiverMode)
  const updateCase = useCaseStore((state) => state.updateCase)
  const updateCaregiver = useCaseStore((state) => state.updateCaregiver)
  const analyzeCurrentCase = useCaseStore((state) => state.analyzeCurrentCase)
  const [error, setError] = useState('')

  const runAnalysis = () => {
    if (!caseData.name.trim()) {
      setError('Add a case name so the evidence packet can be identified.')
      return
    }
    if (![caseData.evidenceText, caseData.manualExtractedText, caseData.suspiciousUrl, caseData.paymentDestination, caseData.contactDetails].some((value) => value.trim())) {
      setError('Add suspicious text, a URL, contact information, or payment details before analysis.')
      return
    }
    setError('')
    analyzeCurrentCase()
    window.scrollTo?.({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="workflow-page intake-page">
      <header className="page-heading">
        <div><p className="eyebrow">Step 2 of 5 · Evidence intake</p><h1>Create a clear case record</h1><p>Describe what happened and preserve only the information needed to understand the request.</p></div>
        <span className="local-processing"><span /> Local browser processing</span>
      </header>

      {caseData.urgency === 'money-at-risk' && (
        <div className="urgent-banner" role="alert"><Siren size={22} aria-hidden="true" /><p><strong>If money is currently at risk, contact your bank or payment provider immediately</strong> using the official number on your card or account website.</p></div>
      )}

      <div className="intake-layout">
        <div className="intake-main">
          <SectionCard>
            <div className="card-heading"><span className="card-index">01</span><div><h2>Case details</h2><p>Use a name that will make sense later without exposing unnecessary private information.</p></div></div>
            <div className="form-grid">
              <label className="field field-full">
                <span>Case name <b aria-hidden="true">*</b></span>
                <input type="text" value={caseData.name} onChange={(event) => updateCase({ name: event.target.value })} placeholder="Example: Suspicious bank text - May 2026" />
              </label>
              <label className="field">
                <span>Your role</span>
                <select value={caseData.role} onChange={(event) => updateCase({ role: event.target.value as typeof caseData.role })}>
                  <option value="target">I may be targeted</option>
                  <option value="family-helper">I am helping a family member</option>
                  <option value="caregiver">I am a caregiver</option>
                  <option value="community-advocate">I work with a nonprofit/community organization</option>
                </select>
              </label>
              <label className="field">
                <span>Scam type suspected</span>
                <select value={caseData.scamType} onChange={(event) => updateCase({ scamType: event.target.value as typeof caseData.scamType })}>
                  <option value="unknown">Unknown / other</option>
                  <option value="bank-payment">Bank / payment scam</option>
                  <option value="romance">Romance scam</option>
                  <option value="tech-support">Tech support scam</option>
                  <option value="government-impersonation">Government / benefits impersonation</option>
                  <option value="delivery">Delivery / shipping scam</option>
                  <option value="job">Job scam</option>
                  <option value="marketplace">Marketplace scam</option>
                  <option value="crypto-investment">Crypto / investment scam</option>
                  <option value="invoice-bec">Invoice / business email compromise</option>
                </select>
              </label>
              <label className="field">
                <span>Urgency</span>
                <select value={caseData.urgency} onChange={(event) => updateCase({ urgency: event.target.value as typeof caseData.urgency })}>
                  <option value="suspicious-only">Just suspicious, no action taken</option>
                  <option value="money-at-risk">Money currently at risk</option>
                  <option value="money-sent">Already sent money</option>
                  <option value="personal-info-shared">Shared personal information</option>
                </select>
              </label>
              <label className="field">
                <span>Contact or payment method</span>
                <select value={caseData.contactMethod} onChange={(event) => updateCase({ contactMethod: event.target.value as typeof caseData.contactMethod })}>
                  <option value="email">Email</option><option value="sms">Text / SMS</option><option value="phone">Phone call</option><option value="social">Social media</option><option value="website">Website</option><option value="payment-app">App / payment platform</option><option value="mail">Mail</option><option value="other">Other</option>
                </select>
              </label>
            </div>
          </SectionCard>

          {caregiverMode && (
            <SectionCard className="caregiver-card">
              <div className="card-heading"><span className="card-index"><HeartHandshake size={20} /></span><div><h2>Caregiver or advocate details</h2><p>The report will be marked “Prepared by caregiver/advocate.”</p></div></div>
              <div className="form-grid">
                <label className="field"><span>Person being helped</span><input value={caseData.caregiver.personHelped} onChange={(event) => updateCaregiver({ personHelped: event.target.value })} /></label>
                <label className="field"><span>Relationship</span><input value={caseData.caregiver.relationship} onChange={(event) => updateCaregiver({ relationship: event.target.value })} /></label>
                <label className="consent-row field-full"><input type="checkbox" checked={caseData.caregiver.hasConsent} onChange={(event) => updateCaregiver({ hasConsent: event.target.checked })} /><span><strong>Permission or consent confirmed</strong><small>I have permission to help organize this information.</small></span></label>
                <label className="field field-full"><span>Notes for caregiver</span><textarea rows={3} value={caseData.caregiver.notes} onChange={(event) => updateCaregiver({ notes: event.target.value })} /></label>
              </div>
            </SectionCard>
          )}

          <SectionCard>
            <div className="card-heading"><span className="card-index">02</span><div><h2>Evidence</h2><p>ScamShield reads only what you enter and does not follow links.</p></div></div>
            <EvidenceInput />
          </SectionCard>

          <SectionCard>
            <div className="card-heading"><span className="card-index">03</span><div><h2>Additional notes</h2><p>Add context that would help a trusted institution understand the sequence of events.</p></div></div>
            <label className="field field-full"><span>Case notes</span><textarea rows={5} value={caseData.notes} onChange={(event) => updateCase({ notes: event.target.value })} placeholder="What happened before or after this message? What actions were already taken?" /></label>
          </SectionCard>

          {error && <p className="form-submit-error" role="alert">{error}</p>}
          <div className="form-actions">
            <p><Info size={17} aria-hidden="true" /> Analysis is deterministic and runs locally. It may miss context.</p>
            <button className="primary-button" type="button" onClick={runAnalysis}>Run local risk assessment <ArrowRight size={18} /></button>
          </div>
        </div>

        <aside className="intake-aside">
          <div className="aside-card">
            <h2>Before you add evidence</h2>
            <ul><li>Remove passwords and login codes.</li><li>Cover full account and card numbers.</li><li>Do not include a full Social Security number.</li><li>Do not open suspicious links to collect more evidence.</li></ul>
          </div>
          {caregiverMode && <div className="aside-card caregiver-check"><h2>Caregiver checklist</h2><ul><li>Confirm the person is safe.</li><li>Ask whether money was sent.</li><li>Ask whether passwords or codes were shared.</li><li>Use calm, non-blaming language.</li><li>Preserve messages and screenshots.</li></ul></div>}
        </aside>
      </div>
    </div>
  )
}
