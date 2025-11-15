/**
 * Validation utilities for form inputs and user data
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEthereumAddress(address: string): boolean {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}

export function validateElectionTitle(title: string): { isValid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: "Election title is required" };
  }

  if (title.length > 100) {
    return { isValid: false, error: "Election title must be less than 100 characters" };
  }

  return { isValid: true };
}

export function validateElectionDescription(description: string): { isValid: boolean; error?: string } {
  if (!description || description.trim().length === 0) {
    return { isValid: false, error: "Election description is required" };
  }

  if (description.length > 500) {
    return { isValid: false, error: "Election description must be less than 500 characters" };
  }

  return { isValid: true };
}

export function validateCandidates(candidates: string[]): { isValid: boolean; error?: string } {
  if (!candidates || candidates.length < 2) {
    return { isValid: false, error: "At least 2 candidates are required" };
  }

  if (candidates.length > 10) {
    return { isValid: false, error: "Maximum 10 candidates allowed" };
  }

  for (const candidate of candidates) {
    if (!candidate || candidate.trim().length === 0) {
      return { isValid: false, error: "All candidate names must be provided" };
    }

    if (candidate.length > 50) {
      return { isValid: false, error: "Candidate names must be less than 50 characters" };
    }
  }

  // Check for duplicates
  const uniqueCandidates = new Set(candidates.map(c => c.trim().toLowerCase()));
  if (uniqueCandidates.size !== candidates.length) {
    return { isValid: false, error: "Candidate names must be unique" };
  }

  return { isValid: true };
}

export function validateDuration(hours: number): { isValid: boolean; error?: string } {
  if (!hours || hours < 1) {
    return { isValid: false, error: "Election duration must be at least 1 hour" };
  }

  if (hours > 168) { // 1 week
    return { isValid: false, error: "Election duration cannot exceed 1 week" };
  }

  return { isValid: true };
}
