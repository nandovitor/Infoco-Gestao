
import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { emails as initialEmails } from '../lib/data';
import { Email } from '../lib/types';
import { Icons } from '../lib/icons';
import Modal from './Modal';

type Folder = 'Inbox' | 'Sent' | 'Drafts' | 'Trash';

const ZohoMail = () => {
    const [emails, setEmails] = useState<Email[]>(initialEmails);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0] || null);
    const [activeFolder, setActiveFolder] = useState<Folder>('Inbox');
    const [isComposeOpen, setComposeOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [attachment, setAttachment] = useState<File | null>(null);
    const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAttachmentChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAttachment(file);
        setIsSending(true); // Re-using isSending state for upload status

        try {
            const response = await fetch(`/api/upload?filename=${file.name}`, {
                method: 'POST',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            const { url } = await response.json();
            setAttachmentUrl(url);
            alert(`Arquivo ${file.name} carregado com sucesso!`);
        } catch (error) {
            console.error("Upload failed", error);
            alert('Falha ao carregar o anexo.');
            setAttachment(null);
        } finally {
            setIsSending(false);
        }
    };
    
    const handleSendEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);
        const formData = new FormData(e.currentTarget);
        let body = formData.get('body') as string;

        if (attachmentUrl) {
            body += `<br/><p><b>Anexo:</b> <a href="${attachmentUrl}" target="_blank">${attachment?.name}</a></p>`;
        }

        const payload = {
            to: formData.get('to'),
            subject: formData.get('subject'),
            body: body,
            fromAddress: 'admin@infoco.com', // This should ideally come from user context
        };

        try {
            const response = await fetch('/api/emails/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha no envio do email.');
            }
            
            alert('Email enviado com sucesso!');
            setComposeOpen(false);
            setAttachment(null);
            setAttachmentUrl(null);

        } catch (error) {
            console.error("Failed to send email", error);
            alert((error as Error).message);
        } finally {
            setIsSending(false);
        }
    };


    return (
        <>
            <div className="page-header">
                <h1>Email (Zoho)</h1>
            </div>
            <div className="email-client card">
                <aside className="email-sidebar">
                    <button className="btn btn-primary" onClick={() => setComposeOpen(true)}>
                        <Icons.add /> Novo Email
                    </button>
                    <ul className="email-folders">
                        <li className={activeFolder === 'Inbox' ? 'active' : ''} onClick={() => setActiveFolder('Inbox')}>Inbox</li>
                        <li className={activeFolder === 'Sent' ? 'active' : ''} onClick={() => setActiveFolder('Sent')}>Enviados</li>
                        <li className={activeFolder === 'Drafts' ? 'active' : ''} onClick={() => setActiveFolder('Drafts')}>Rascunhos</li>
                        <li className={activeFolder === 'Trash' ? 'active' : ''} onClick={() => setActiveFolder('Trash')}>Lixeira</li>
                    </ul>
                </aside>
                <section className="email-list">
                    {emails.map(email => (
                        <div key={email.id} className={`email-item ${selectedEmail?.id === email.id ? 'active' : ''}`} onClick={() => setSelectedEmail(email)}>
                            <h4>{email.sender}</h4>
                            <p style={{fontWeight: email.read ? 400 : 600}}>{email.subject}</p>
                            <p>{email.snippet}</p>
                        </div>
                    ))}
                </section>
                <main className="email-content">
                    {selectedEmail ? (
                        <>
                            <div className="email-content-header">
                                <h2>{selectedEmail.subject}</h2>
                                <p>De: {selectedEmail.sender}</p>
                            </div>
                            <div className="email-body" dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                        </>
                    ) : (
                        <p>Selecione um email para ler.</p>
                    )}
                </main>
            </div>

            <Modal
                isOpen={isComposeOpen}
                onClose={() => setComposeOpen(false)}
                title="Novo Email"
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setComposeOpen(false)} disabled={isSending}>Cancelar</button>
                        <button type="submit" form="email-form" className="btn btn-primary" disabled={isSending}>
                            {isSending ? 'Enviando...' : <><Icons.send className="w-5 h-5" /> Enviar</>}
                        </button>
                    </>
                }
            >
                <form id="email-form" className="form-grid" onSubmit={handleSendEmail}>
                    <div className="form-group" style={{gridColumn: '1 / -1'}}>
                        <label htmlFor="to">Para</label>
                        <input type="email" id="to" name="to" placeholder="email@exemplo.com" required />
                    </div>
                    <div className="form-group" style={{gridColumn: '1 / -1'}}>
                        <label htmlFor="subject">Assunto</label>
                        <input type="text" id="subject" name="subject" required />
                    </div>
                    <div className="form-group" style={{gridColumn: '1 / -1'}}>
                        <label htmlFor="body">Mensagem</label>
                        <textarea id="body" name="body" rows={8} style={{padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', fontSize: '1rem', fontFamily: 'inherit'}} required></textarea>
                    </div>
                    <div className="form-group" style={{gridColumn: '1 / -1'}}>
                         <input type="file" ref={fileInputRef} onChange={handleAttachmentChange} style={{display: 'none'}} />
                         <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={isSending}>
                            <Icons.attachment className="w-5 h-5" /> {attachment ? attachment.name : 'Anexar Arquivo'}
                        </button>
                        {attachmentUrl && <small style={{marginTop: '8px', display: 'block'}}>Anexo carregado com sucesso!</small>}
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default ZohoMail;
