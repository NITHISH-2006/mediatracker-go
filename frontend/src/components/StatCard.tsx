interface Props {
  label: string
  value: number
  color?: string
}

export default function StatCard({ label, value, color = 'bg-purple-100 text-purple-800' }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}