from django.urls import path,include
from .import views
from rest_framework import routers

router=routers.DefaultRouter(trailing_slash=False)
router.register('diagnostic-bills',views.DiagnosticBillAPI)
router.register('history-payments',views.HistoryPaymentAPI)

urlpatterns=[
    path('reports/financial-figures',views.get_financial_figure),
    path('reports/get_revenue_profit_figure',views.get_revenue_profit_figure_API)
]
urlpatterns+=router.urls