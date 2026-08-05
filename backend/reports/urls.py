from django.urls import path

from .views import (
    DailyReportView,
    MonthlyReportView,
    ReportExportView,
    WeeklyReportView,
)

urlpatterns = [
    path("daily/", DailyReportView.as_view(), name="report-daily"),
    path("weekly/", WeeklyReportView.as_view(), name="report-weekly"),
    path("monthly/", MonthlyReportView.as_view(), name="report-monthly"),
    path("export/", ReportExportView.as_view(), name="report-export"),
]
