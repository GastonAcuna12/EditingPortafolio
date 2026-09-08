import { Reveal } from "./Reveal"

export function FeaturedClients({ clients, copy }) {
  if (!clients.length) return null
  return (
    <section className="clients-section shell" aria-labelledby="clients-title">
      <Reveal><p className="eyebrow">{copy.label}</p><h2 id="clients-title">{copy.title}</h2><ul className="client-names">{clients.map((client) => <li key={client.name}>{client.name}</li>)}</ul></Reveal>
    </section>
  )
}
