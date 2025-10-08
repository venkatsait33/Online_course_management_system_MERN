import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Charts = ({ report }) => {
    return (
        <div> <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {/* Bar Chart - Enrollments by Course */}
            <div className="bg-gray-500 p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-semibold mb-4">📈 Students Enrolled per Course</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="title" tick={{ fill: "#fff", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#fff" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#333", borderRadius: "10px" }} />
                        <Legend />
                        <Bar dataKey="totalEnrolled" fill="#00C49F" barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart - Course Distribution */}
            <div className="bg-base-300 p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-semibold mb-4">📊 Enrollment Share by Course</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={report}
                            dataKey="totalEnrolled"
                            nameKey="title"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            label
                        >
                            {report.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "10px" }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div></div>
    )
}

export default Charts