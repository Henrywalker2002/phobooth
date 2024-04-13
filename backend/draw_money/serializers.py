from rest_framework import serializers
from draw_money.models import DrawMoney
from studio.serializers import StudioSummarySerializer, StudioDetailSerializer


class CreateDrawMoneySerializer(serializers.ModelSerializer):

    amount = serializers.IntegerField(required=False)

    def validate_amount(self, value):
        if value <= 10000:
            raise serializers.ValidationError(
                "Amount must be greater than 10000")
        context = self.context
        if value > context["request"].user.studio.account_balance:
            raise serializers.ValidationError(
                "Amount must be less than or equal to account balance")
        return value

    def validate(self, attrs):
        context = self.context
        if not context['request'].user.studio.account_number:
            raise serializers.ValidationError(
                "Studio does not have account number")
        return attrs
    
    class Meta:
        model = DrawMoney
        fields = ["amount"]


class UpdateDrawMoneySerializer(serializers.ModelSerializer):
    
    def validate(self, attrs):
        if self.instance.status != "PENDING":
            raise serializers.ValidationError("Can not update draw money")
        return attrs

    class Meta:
        model = DrawMoney
        fields = ["status","transation_id"]


class ReadSummrayDrawMoneySerializer(serializers.ModelSerializer):

    studio = StudioSummarySerializer()
    
    class Meta:
        model = DrawMoney
        fields = ["id", "studio", "amount", "status", "transation_id"]

class ReadDetailDrawMoneySerializer(serializers.ModelSerializer):

    studio = StudioDetailSerializer()
    
    class Meta:
        model = DrawMoney
        fields = ["id", "studio", "amount", "status", "transation_id"]