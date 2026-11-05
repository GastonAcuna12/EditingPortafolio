// Client logos run as one slow, constant line, like end credits. Every logo is tinted the same
// cream through a CSS mask, so the row reads as one family. The second copy only closes the loop.
const logoUrl = (file) => `${import.meta.env.BASE_URL}clients/${file}`

export function FeaturedClients({ clients, copy }) {
  if (!clients.length) return null
  const logos = (hidden) => (
    <ul className="clients-run" aria-hidden={hidden || undefined}>
      {clients.map((client) => (
        <li key={client.name}>
          <span
            className="client-logo"
            role={hidden ? undefined : "img"}
            aria-label={hidden ? undefined : client.name}
            style={{ "--logo": `url("${logoUrl(client.logo)}")`, "--ratio": client.ratio, "--scale": client.scale ?? 1 }}
          />
        </li>
      ))}
    </ul>
  )
  return (
    <section className="clients-section" aria-labelledby="clients-title">
      <div className="clients-head shell">
        <h2 id="clients-title" className="eyebrow">{copy.label}</h2>
      </div>
      <div className="clients-marquee">
        <div className="clients-track">{logos(false)}{logos(true)}</div>
      </div>
    </section>
  )
}
