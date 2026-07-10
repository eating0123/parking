window.DeepSeekBridge = {
  apiKey: window.DEEPSEEK_API_KEY || '',
  endpoint: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-chat',
  async chat(messages) {
    this.apiKey = window.DEEPSEEK_API_KEY || this.apiKey || '';
    if (!this.apiKey || this.apiKey.includes('填')) {
      return null;
    }
    const res = await fetch(this.endpoint, {
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
