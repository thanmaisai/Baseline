import clarity from '@microsoft/clarity';

/**
 * Analytics utility for tracking user interactions with Microsoft Clarity
 * 
 * @microsoft/clarity NPM Package API Reference:
 * - clarity.init(projectId) - Initialize Clarity
 * - clarity.event(eventName) - Track custom events (single string param)
 * - clarity.setTag(key, value) - Set custom tags for filtering
 * - clarity.identify(userId, sessionId?, pageId?, friendlyName?) - Identify users
 * - clarity.upgrade(reason) - Prioritize session for recording
 * - clarity.consent(consent?) - Set cookie consent
 */

export type EventCategory = 
  | 'navigation'
  | 'tool_selection'
  | 'script_generation'
  | 'scan_operation'
  | 'template_selection'
  | 'export'
  | 'user_interaction';

export type EventAction =
  | 'click'
  | 'download'
  | 'upload'
  | 'copy'
  | 'select'
  | 'deselect'
  | 'navigate'
  | 'search'
  | 'filter'
  | 'generate'
  | 'scan'
  | 'share';

interface AnalyticsEvent {
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

/**
 * Helper to safely call Clarity API methods
 */
const safeClarity = {
  event: (name: string) => {
    try {
      clarity.event(name);
    } catch (e) {
      // Clarity might not be loaded yet
    }
  },
  setTag: (key: string, value: string | string[]) => {
    try {
      clarity.setTag(key, value);
    } catch (e) {
      // Clarity might not be loaded yet
    }
  },
  upgrade: (reason: string) => {
    try {
      clarity.upgrade(reason);
    } catch (e) {
      // Clarity might not be loaded yet
    }
  },
  identify: (customId: string, customSessionId?: string, customPageId?: string, friendlyName?: string) => {
    try {
      clarity.identify(customId, customSessionId, customPageId, friendlyName);
    } catch (e) {
      // Clarity might not be loaded yet
    }
  }
};

/**
 * Track custom events with Microsoft Clarity
 * 
 * Creates descriptive event names combining category, action, and label
 * Additional metadata is set as custom tags for filtering in Clarity dashboard
 */
export const trackEvent = (event: AnalyticsEvent) => {
  try {
    // Create a descriptive event name (Clarity accepts single string)
    let eventName = `${event.category}_${event.action}`;
    if (event.label) {
      // Include label in event name for better tracking
      eventName = `${eventName}_${event.label.replace(/\s+/g, '_').toLowerCase()}`;
    }

    // Send custom event to Clarity
    safeClarity.event(eventName);
    
    // Set contextual tags for this event (helps with filtering)
    safeClarity.setTag('last_event_category', event.category);
    safeClarity.setTag('last_event_action', event.action);
    
    if (event.label) {
      safeClarity.setTag('last_event_label', event.label);
    }
    
    if (event.value !== undefined) {
      safeClarity.setTag('last_event_value', String(event.value));
    }
    
    // Set additional metadata as custom tags for filtering
    if (event.metadata) {
      Object.entries(event.metadata).forEach(([key, val]) => {
        if (typeof val === 'string') {
          safeClarity.setTag(key, val);
        } else if (Array.isArray(val)) {
          safeClarity.setTag(key, val.map(String));
        } else if (val !== undefined && val !== null) {
          safeClarity.setTag(key, String(val));
        }
      });
    }
    
    // Log in development for debugging
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventName, { label: event.label, value: event.value, ...event.metadata });
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

/**
 * Track page views
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  try {
    const title = pageTitle || document.title;
    
    // Create a page-specific event name
    const pageEvent = `page_view_${pagePath.replace(/\//g, '_').replace(/^_/, '')}`;
    
    // Track page view as custom event
    safeClarity.event(pageEvent);
    
    // Set page info as tags for filtering
    safeClarity.setTag('current_page', pagePath);
    safeClarity.setTag('page_title', title);

    if (import.meta.env.DEV) {
      console.log('[Analytics] Page View:', pagePath, title);
    }
  } catch (error) {
    console.error('Analytics page view error:', error);
  }
};

/**
 * Set user properties for better segmentation
 */
export const setUserProperties = (properties: Record<string, string>) => {
  try {
    Object.entries(properties).forEach(([key, value]) => {
      safeClarity.setTag(key, value);
    });

    if (import.meta.env.DEV) {
      console.log('[Analytics] User Properties:', properties);
    }
  } catch (error) {
    console.error('Analytics user properties error:', error);
  }
};

/**
 * Track tool selection in Configurator
 */
export const trackToolSelection = (toolId: string, toolName: string, isSelected: boolean) => {
  trackEvent({
    category: 'tool_selection',
    action: isSelected ? 'select' : 'deselect',
    label: toolName,
    metadata: {
      tool_id: toolId,
      tool_name: toolName,
    },
  });
};

/**
 * Track template selection
 */
export const trackTemplateSelection = (templateId: string, templateName: string) => {
  trackEvent({
    category: 'template_selection',
    action: 'select',
    label: templateName,
    metadata: {
      template_id: templateId,
      template_name: templateName,
    },
  });
};

/**
 * Track script generation
 */
export const trackScriptGeneration = (toolCount: number, method: 'configurator' | 'scan') => {
  trackEvent({
    category: 'script_generation',
    action: 'generate',
    label: method,
    value: toolCount,
    metadata: {
      tool_count: toolCount,
      generation_method: method,
    },
  });
};

/**
 * Track script download
 */
export const trackScriptDownload = (toolCount: number, method: 'configurator' | 'scan') => {
  trackEvent({
    category: 'script_generation',
    action: 'download',
    label: method,
    value: toolCount,
    metadata: {
      tool_count: toolCount,
      generation_method: method,
    },
  });
};

/**
 * Track search interactions
 */
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent({
    category: 'user_interaction',
    action: 'search',
    label: query,
    value: resultsCount,
    metadata: {
      search_query: query,
      results_count: resultsCount,
    },
  });
};

/**
 * Track scan operations
 */
export const trackScanOperation = (operation: 'download_script' | 'upload_scan' | 'generate_from_scan') => {
  trackEvent({
    category: 'scan_operation',
    action: operation === 'download_script' ? 'download' : operation === 'upload_scan' ? 'upload' : 'generate',
    label: operation,
  });
};

/**
 * Track navigation between pages
 */
export const trackNavigation = (from: string, to: string) => {
  trackEvent({
    category: 'navigation',
    action: 'navigate',
    label: `${from} -> ${to}`,
    metadata: {
      from_page: from,
      to_page: to,
    },
  });
};

/**
 * Track copy operations
 */
export const trackCopy = (content: string, context: string) => {
  trackEvent({
    category: 'user_interaction',
    action: 'copy',
    label: context,
    metadata: {
      content_type: content,
      context,
    },
  });
};

/**
 * Track share card generation
 */
export const trackShareCard = (toolCount: number) => {
  trackEvent({
    category: 'export',
    action: 'share',
    label: 'shareable_card',
    value: toolCount,
    metadata: {
      tool_count: toolCount,
    },
  });
};

/**
 * Track errors for debugging
 */
export const trackError = (error: string, context: string) => {
  trackEvent({
    category: 'user_interaction',
    action: 'click',
    label: 'error',
    metadata: {
      error_message: error,
      error_context: context,
    },
  });
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (ctaLabel: string, location: string) => {
  trackEvent({
    category: 'navigation',
    action: 'click',
    label: ctaLabel,
    metadata: {
      cta_label: ctaLabel,
      location,
    },
  });
};
