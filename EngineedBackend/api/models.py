from django.db import models
from django.contrib.auth.models import User


from django.db import models
from django.utils import timezone
from django.conf import settings


class Note(models.Model):
    # Shared fields
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="classnotes"
    )
    created_at = models.DateTimeField(auto_now_add=True) 

    # Submission-specific fields
    fullName = models.CharField(max_length=75, blank=True, null=True)  
    gradeSection = models.CharField(max_length=40, blank=True, null=True) 
    completed = models.BooleanField(default=False)  
    dateSubmitted = models.DateTimeField(default=timezone.now)

    DAMAGED_PROPERTY_CHOICES = [
        ('chair', 'Chair'),
        ('table', 'Table'),
        ('electricfan', 'Electric Fan'),
        ('outlet', 'Outlet'),
        ('television', 'Television'),
        ('whiteboard', 'Whiteboard'),
        ('tiles', 'Tiles'),
        ('window', 'Window'),
        ('other', 'Other'),
    ]

    damagedProperty = models.CharField(
        max_length=5000,
        choices=DAMAGED_PROPERTY_CHOICES,
        blank=True,  # Optional for notes
        null=True,
        default=None  # Default to None for optional field
    )
    comment = models.TextField(blank=True, null=True)  # Optional comment

    def __str__(self):
        if self.damagedProperty:
            return (
                f"{self.fullName or 'N/A'} ({self.gradeSection or 'N/A'}) - "
                f"Damaged Property: {self.damagedProperty}, Comment: {self.comment or 'No comment'}"
            )
        return f"Note by {self.fullName or 'Anonymous'}"
