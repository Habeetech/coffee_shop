import "./FormSection.css"

export default function FormSection({ title, children }) {
  return (
    <section className="form-section">
      <h3>{title}</h3>
      <div className="section-children">
          {children}
      </div>
    </section>
  );
}
