const BASE_URL = import.meta.env.VITE_APP_BASE_API

// 客户列表
export const sendAIMessage = async (data, chatId) => {
  try {
    const url = `${BASE_URL}/ai/chat?chatId=${chatId}`
    const response = await fetch(url, {
      method: 'POST',
      body: data instanceof FormData ? data : new URLSearchParams({ prompt: data })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response?.body?.getReader()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
