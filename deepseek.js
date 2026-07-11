window.DeepSeekBridge = {
  apiKey: window.DEEPSEEK_API_KEY || '',
  endpoint: '/api/deepseek',
  directEndpoint: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-chat',
  async chat(messages) {
    if (location.protocol.startsWith('http')) {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      if (res.ok) {
        const data = await res.json();
        return data?.content || '';
      }
    }

    this.apiKey = window.DEEPSEEK_API_KEY || this.apiKey || '';
    if (!this.apiKey || this.apiKey.includes('填')) {
      return null;
    }
    const res = await fetch(this.directEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.4,
        stream: false
      })
    });
    if (!res.ok) throw new Error(`DeepSeek API ${res.status}`);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '';
  }
};
