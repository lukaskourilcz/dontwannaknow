import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
};

type State = {
  error: Error | null;
};

/**
 * Top-level error boundary. Catches any render-time crash anywhere in
 * the tree below it and shows a friendly recovery card instead of a
 * blank page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }): void {
    console.error("UI crashed:", error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  hardReset = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "";
      window.location.reload();
    }
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div className="error-boundary" role="alert">
        <div className="error-boundary-inner">
          <p className="eyebrow">Oh no</p>
          <h2>Something broke</h2>
          <p className="error-boundary-msg">
            Try going back to the form. If it happens again, the link
            you arrived with might be corrupt — start fresh and rebuild
            the report.
          </p>
          <details className="error-boundary-details">
            <summary>Technical details</summary>
            <pre>{error.message}</pre>
          </details>
          <div className="error-boundary-actions">
            <button type="button" className="primary" onClick={this.reset}>
              Try again
            </button>
            <button type="button" className="secondary" onClick={this.hardReset}>
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }
}
