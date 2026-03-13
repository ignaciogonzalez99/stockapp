interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    color: 'green' | 'purple' | 'red' | 'blue' | 'brown' | 'gray';
    icon: React.ReactNode;
}

export function StatCard({ title, value, subtitle, color, icon }: StatCardProps) {
    const colorClasses = {
        green: 'bg-green-500',
        purple: 'bg-purple-600',
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        brown: 'bg-amber-800',
        gray: 'bg-slate-600',
    };

    return (
        <div className={`${colorClasses[color]} rounded-lg p-4 text-white shadow-md`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <span className="text-3xl font-bold">{value}</span>
            </div>
            <p className="mt-2 text-sm opacity-90">{subtitle}</p>
        </div>
    );
}
