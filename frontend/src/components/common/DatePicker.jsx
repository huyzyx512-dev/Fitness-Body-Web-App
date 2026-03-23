import { useState } from 'react'
import Button from './Button'

const DatePicker = ({ selectedDate, onDateChange, className = '' }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Generate calendar days for current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const days = []

    // Add empty cells for days before the first day of the month
    const firstDayOfWeek = firstDay.getDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const currentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  const days = getDaysInMonth(currentMonth)

  // Navigation functions
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    onDateChange(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
    setIsCalendarOpen(false)
  }

  const selectDate = (date) => {
    if (date) {
      onDateChange(date)
      setIsCalendarOpen(false)
    }
  }

  // Check if date is today
  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Check if date is selected
  const isSelected = (date) => {
    return date && selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={`relative ${className}`}>
      {/* Date display button */}
      <button
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedDate.toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Calendar dropdown */}
      {isCalendarOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Calendar header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <button
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-sm font-medium text-gray-900">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </div>

            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 px-2 py-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 px-2 pb-3">
            {days.map((date, index) => (
              <button
                key={index}
                onClick={() => selectDate(date)}
                disabled={!date}
                className={`
                  w-8 h-8 text-sm rounded-md hover:bg-gray-100 disabled:hover:bg-transparent
                  ${date ? 'cursor-pointer' : 'cursor-default'}
                  ${isSelected(date) ? 'bg-emerald-600 text-white hover:bg-primary-700' : ''}
                  ${isToday(date) && !isSelected(date) ? 'bg-gray-100 text-primary-600 font-semibold' : ''}
                  ${date && !isSelected(date) && !isToday(date) ? 'text-gray-900' : ''}
                `}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>

          {/* Footer with today button */}
          <div className="px-4 py-2 border-t border-gray-200">
            <Button
              onClick={goToToday}
              size="sm"
              className="w-full"
            >
              Today
            </Button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isCalendarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsCalendarOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default DatePicker