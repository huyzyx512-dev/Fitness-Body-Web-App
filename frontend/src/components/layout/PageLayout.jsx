/**
 * Consistent wrapper for dashboard pages: container + optional title and actions.
 */
const PageLayout = ({ title, actions, children, className = '' }) => {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {title && <h1 className="page-title">{title}</h1>}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageLayout;
