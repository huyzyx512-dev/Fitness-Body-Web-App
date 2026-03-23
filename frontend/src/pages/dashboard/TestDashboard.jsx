import { useEffect, useState } from "react"
import Button from "../../components/common/Button"

const TestDashboard = () => {
    const user = []
    const userProfile = {
        firstName: "Huy Nguyen"
    }
    const [stats, setStats] = useState({
        food: { today: 0, weekly: 0, loading: true },
        workout: { today: 0, weekly: 0, streak: 0, loading: true },
        progress: { currentWeight: null, bmi: null, weightChange: 0, loading: true }
    })
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (!user) return

        fetchDashboardData()
    }, [user])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            // Get today's date and start of week
            const today = new Date()
            const todayStr = today.toISOString().split('T')[0]
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - 7)
            const weekStartStr = weekStart.toISOString().split('T')[0]

            // Fetch food data for today and this week


            // Fetch workout data for today and this week


            // Calculate workout streak (simplified - workouts in last 7 days)


            // Calculate BMI if we have weight and user profile has height


            // Fetch recent activity (last 5 items from foods and workouts)

            setStats({
                food: {
                    today: todayCalories,
                    weekly: Math.round(weeklyCalories / 7), // Daily average
                    loading: false
                },
                workout: {
                    today: todayMinutes,
                    weekly: Math.round(weeklyMinutes / 7), // Daily average
                    streak: streak,
                    loading: false
                },
                progress: {
                    currentWeight: currentWeight,
                    bmi: bmi,
                    weightChange: weightChange,
                    loading: false
                }
            })

            setRecentActivity(activities)

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getCalorieGoal = () => {
        // Default goal - could be personalized based on user profile
        return 2000
    }

    const getCalorieProgress = () => {
        const goal = getCalorieGoal()
        return Math.min((stats.food.today / goal) * 100, 100)
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back{userProfile?.firstName ? `, ${userProfile.firstName}` : ''}! 👋
                </h1>
                <p className="text-gray-600">
                    Dưới đây là thông tin tổng quan về thể chất của bạn vào {new Date().toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Calories Today */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Calories Today</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.food.today}</p>
                            <p className="text-xs text-gray-500">Goal: {getCalorieGoal()}</p>
                        </div>
                        <div className="text-3xl">🍎</div>
                    </div>
                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getCalorieProgress()}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{Math.round(getCalorieProgress())}% of daily goal</p>
                    </div>
                </div>

                {/* Workout Today */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Workout Today</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.workout.today} min</p>
                            <p className="text-xs text-gray-500">Weekly avg: {stats.workout.weekly} min</p>
                        </div>
                        <div className="text-3xl">💪</div>
                    </div>
                    <div className="mt-3">
                        <div className="flex items-center text-xs">
                            <span className="text-orange-600 font-medium">🔥 {stats.workout.streak} day streak</span>
                        </div>
                    </div>
                </div>

                {/* Current Weight */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Current Weight</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.progress.currentWeight ? `${stats.progress.currentWeight} kg` : 'Not set'}
                            </p>
                            {stats.progress.weightChange !== 0 && (
                                <p className={`text-xs ${stats.progress.weightChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {stats.progress.weightChange > 0 ? '+' : ''}{stats.progress.weightChange.toFixed(1)} kg this week
                                </p>
                            )}
                        </div>
                        <div className="text-3xl">⚖️</div>
                    </div>
                </div>

                {/* BMI */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">BMI</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.progress.bmi ? stats.progress.bmi.toFixed(1) : 'N/A'}
                            </p>
                            {stats.progress.bmi && (
                                <p className="text-xs text-gray-500">
                                    {stats.progress.bmi < 18.5 ? 'Underweight' :
                                        stats.progress.bmi < 25 ? 'Normal' :
                                            stats.progress.bmi < 30 ? 'Overweight' : 'Obese'}
                                </p>
                            )}
                        </div>
                        <div className="text-3xl">📊</div>
                    </div>
                </div>
            </div>
         
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Activity</h2>

                        {recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-4">📝</div>
                                <p className="text-lg font-medium mb-2">No activity yet today</p>
                                <p className="text-sm mb-4">Start logging your meals and workouts!</p>
                                <div className="flex gap-3 justify-center">
                                    <Button size="sm" onClick={() => window.location.href = '/food-tracker'}>
                                        🍎 Log Food
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={() => window.location.href = '/workout-tracker'}>
                                        💪 Log Workout
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{activity.icon}</span>
                                            <div>
                                                <p className="font-medium text-gray-900">{activity.name}</p>
                                                <p className="text-sm text-gray-500">{activity.value}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">{formatTime(activity.time)}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${activity.type === 'food' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {activity.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button
                                className="w-full justify-start"
                                onClick={() => window.location.href = '/food-tracker'}
                            >
                                🍎 Log Food
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={() => window.location.href = '/workout-tracker'}
                            >
                                💪 Log Workout
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={() => window.location.href = '/bmi'}
                            >
                                📊 BMI Calculator
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={() => window.location.href = '/progress'}
                            >
                                📈 View Progress
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={() => window.location.href = '/ai'}
                            >
                                🤖 AI Assistant
                            </Button>
                        </div>
                    </div>

                    {/* Weekly Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">This Week</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Avg. Calories:</span>
                                <span className="font-medium">{stats.food.weekly}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Avg. Workout:</span>
                                <span className="font-medium">{stats.workout.weekly} min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Workout Days:</span>
                                <span className="font-medium">{stats.workout.streak}/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestDashboard