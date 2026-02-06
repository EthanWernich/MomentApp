import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../lib/themes';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorDetails: string | null;
  errorId: string | null;
}

const LAST_ERROR_KEY = 'LAST_APP_ERROR_V1';

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorDetails: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    const errorId = new Date().toISOString();
    const details = [
      `ErrorId: ${errorId}`,
      `Name: ${error?.name ?? 'UnknownError'}`,
      `Message: ${error?.message ?? 'Unknown message'}`,
      `Stack: ${error?.stack ?? 'No stack'}`,
      `ComponentStack: ${errorInfo?.componentStack ?? 'No component stack'}`,
    ].join('\n');

    this.setState({ errorDetails: details, errorId });

    AsyncStorage.setItem(
      LAST_ERROR_KEY,
      JSON.stringify({ id: errorId, details })
    ).catch((storageError) => {
      console.error('[ErrorBoundary] Failed to persist error:', storageError);
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorDetails: null, errorId: null });
  };

  render() {
    if (this.state.hasError) {
      const colors = themes.midnight; // Use default theme for error screen

      return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>
              Something went wrong
            </Text>
            <Text style={[styles.message, { color: colors.textMuted }]}>
              The app encountered an error. Please try restarting.
            </Text>
            {!!this.state.errorId && (
              <Text style={[styles.errorDetails, { color: colors.textMuted }]}>
                Error ID: {this.state.errorId}
              </Text>
            )}
            {this.state.errorDetails && (
              <Text style={[styles.errorDetails, { color: colors.textMuted }]}>
                {this.state.errorDetails}
              </Text>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.accent }]}
              onPress={this.handleReset}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorDetails: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
