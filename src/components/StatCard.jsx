function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "blue",
}) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${color}`}>
        <Icon size={23} />
      </div>

      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3>{value}</h3>
        <p className="stat-description">{description}</p>
      </div>
    </article>
  );
}

export default StatCard;