import { FileImage, FileText, Trash2, UploadCloud } from 'lucide-react'
import { useId, useState } from 'react'
import { useCaseStore } from '../../store/useCaseStore'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const acceptedTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']

export function FileUploader() {
  const inputId = useId()
  const attachments = useCaseStore((state) => state.caseData.attachments)
  const addAttachment = useCaseStore((state) => state.addAttachment)
  const removeAttachment = useCaseStore((state) => state.removeAttachment)
  const [error, setError] = useState('')

  const onFiles = (files: FileList | null) => {
    setError('')
    for (const file of Array.from(files ?? [])) {
      if (!acceptedTypes.includes(file.type)) {
        setError('Use a PNG, JPG, WEBP, or PDF file. Other file types are not opened.')
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('Each file must be 10 MB or smaller.')
        continue
      }
      addAttachment({
        id: globalThis.crypto?.randomUUID?.() ?? `file-${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl: file.type.startsWith('image/') && typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : undefined,
      })
    }
  }

  return (
    <div className="file-uploader">
      <label className="dropzone" htmlFor={inputId}>
        <UploadCloud size={26} aria-hidden="true" />
        <strong>Upload screenshots or documents</strong>
        <span>PNG, JPG, WEBP, or PDF up to 10 MB</span>
        <small>Remove passwords, full account numbers, SSNs, and authentication codes first.</small>
      </label>
      <input
        id={inputId}
        className="visually-hidden"
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        multiple
        onChange={(event) => onFiles(event.target.files)}
        aria-describedby={`${inputId}-privacy`}
      />
      <p id={`${inputId}-privacy`} className="privacy-inline">The file stays in this browser. ScamShield does not upload it to a server.</p>
      {error && <p className="field-error" role="alert">{error}</p>}
      {attachments.length > 0 && (
        <ul className="attachment-list" aria-label="Attached evidence files">
          {attachments.map((file) => (
            <li key={file.id}>
              {file.previewUrl ? <img src={file.previewUrl} alt="Local preview of attached evidence" /> : file.type === 'application/pdf' ? <FileText aria-hidden="true" /> : <FileImage aria-hidden="true" />}
              <span><strong>{file.name}</strong><small>{file.type || 'Unknown type'} · {Math.max(1, Math.round(file.size / 1024))} KB</small></span>
              <button type="button" className="icon-button" onClick={() => removeAttachment(file.id)} aria-label={`Remove ${file.name}`}><Trash2 size={17} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
