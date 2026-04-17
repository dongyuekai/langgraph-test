import { Annotation, END, START, StateGraph } from '@langchain/langgraph'

const stateAnnotation = Annotation.Root({
  query: Annotation({
    reducer: (_prev, next) => next,
    default: () => ''
  }),
  route: Annotation({
    reducer: (_prev, next) => next,
    default: () => 'chat'
  }),
  answer: Annotation({
    reducer: (_prev, next) => next,
    default: () => ''
  })
})

const router = state => {
  const isMath = /[+\-*/]/.test(state.query)
  return { route: isMath ? 'math' : 'chat' }
}
const mathNode = state => {
  try {
    return { answer: String(eval(state.query)) }
  } catch {
    return { answer: '表达式无法计算' }
  }
}
const chatNode = state => ({ answer: `你说的是: ${state.query}` })

const step2 = state => ({ text: `${state.text} -> step2` })

const graph = new StateGraph(stateAnnotation)
  .addNode('router', router)
  .addNode('math', mathNode)
  .addNode('chat', chatNode)
  .addEdge(START, 'router')
  .addConditionalEdges('router', state => state.route, {
    math: 'math',
    chat: 'chat'
  })
  .addEdge('math', END)
  .addEdge('chat', END)
  .compile()

// 导出为Mermaind: 可复制到https://mermaid.live/中或Markdown的 mermaind 代码块
const drawable = await graph.getGraphAsync()
const mermaid = drawable.drawMermaid({ withStyles: true })
console.log(mermaid)

console.log('result1==', await graph.invoke({ query: '你好' }))
console.log('result2==', await graph.invoke({ query: '2 + 2' }))