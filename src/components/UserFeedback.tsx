const handleToggle = () => {
  setIsExpanded(!isExpanded);
  
  // 添加用户行为埋点
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'toggle_feedback', {
      'event_category': 'feedback',
      'event_label': isExpanded ? 'collapse' : 'expand',
      'value': 1
    });
  }
}; 