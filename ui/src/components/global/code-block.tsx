export default function CodeBlock({ children }: { children: string }) {
  return <code
    className="
    relative
    block p-2
    overflow-x-auto
    font-mono
    text-sm
    font-semibold
    whitespace-pre-wrap
    ">
    {children}
  </code>;
}
