from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Extract password before popping it
        password = validated_data.pop("password")
        username = validated_data.get("username")

        # Check if the user already exists
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})

        # Create user and set password properly
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user



class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "id",
            "created_at",
            "author",
            "fullName",
            "gradeSection",
            "completed",
            "dateSubmitted",
            "damagedProperty",
            "comment",
        ]
        extra_kwargs = {
            "author": {"read_only": True}, 
            "created_at": {"read_only": True},  
            "dateSubmitted": {"required": False},  
        }