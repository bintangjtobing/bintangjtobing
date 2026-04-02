export default function VerifiedBadge({ className = 'verified-badge' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 1l2.09 3.07L17.5 3.5l-.57 3.43L20 9.09l-2.62 2.09.54 3.44-3.19 1.25L12 19l-2.73-3.13-3.19-1.25.54-3.44L4 9.09l3.07-2.16-.57-3.43 3.41.57L12 1z" fill="var(--blue)" stroke="var(--blue)" strokeWidth="1.5"/>
      <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
