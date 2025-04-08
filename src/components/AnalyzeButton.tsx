const handleAnalyze = async () => {
  if (!appId) {
    setError('请输入应用ID');
    return;
  }

  // 添加用户行为埋点
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'start_analysis', {
      'event_category': 'analysis',
      'event_label': 'start_analysis',
      'value': 1
    });
  }

  setIsLoading(true);
  setError(null);

  // ... existing code ...
} 