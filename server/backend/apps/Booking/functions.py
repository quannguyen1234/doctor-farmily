from .models import Rating
from statistics import mean

def get_mean_star(doctor):
    stars=list(Rating.objects.filter(
        doctor=doctor
    ).values_list('star',flat=True))
    if len(stars)==0:
        return None
    return mean(stars)