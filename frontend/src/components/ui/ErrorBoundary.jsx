import { Component } from 'react';

// Without this, one thrown error inside a page unmounts the whole application
// and leaves a blank screen with nothing to go on. This catches it and shows
// what actually failed.
//
// A class is the only way to catch render errors in React — there is no hook
// equivalent — so this is the single class component in the project.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Also logged so the full component stack is available in the console.
    console.error('Page crashed:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="state-panel error-state" role="alert">
        <i className="bi bi-exclamation-triangle" />
        <h3>This page hit an error</h3>
        <p>{error.message || String(error)}</p>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => this.setState({ error: null })}
        >
          Try again
        </button>
      </div>
    );
  }
}
