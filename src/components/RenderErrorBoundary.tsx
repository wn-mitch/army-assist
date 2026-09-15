import React from "react";

import Button from "@/components/ui/Button";

type RenderErrorBoundaryProps = {
  children: React.ReactNode;
  onRecover: () => void;
};

type RenderErrorBoundaryState = { hasError: boolean };

/**
 * Keeps the application shell available when an unexpected list-body render
 * failure escapes the normal import-failure path.
 */
export default class RenderErrorBoundary extends React.Component<
  RenderErrorBoundaryProps,
  RenderErrorBoundaryState
> {
  state: RenderErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RenderErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("List body render failed", error, info.componentStack);
  }

  private recover = () => {
    this.props.onRecover();
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex flex-1 items-center justify-center p-6">
          <section
            className="max-w-lg rounded-lg border border-danger/30 bg-danger/5 p-6 text-center shadow-sm"
            role="alert"
          >
            <p className="text-base font-semibold text-text">
              We couldn't display this list. Its source text is still saved.
            </p>
            <Button
              id="render-error-return-button"
              variant="danger"
              className="mt-4"
              onClick={this.recover}
            >
              Return to saved lists
            </Button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
