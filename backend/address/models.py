from django.db import models


class Province(models.Model):
    code = models.IntegerField(unique=True, primary_key = True)
    name = models.CharField(max_length=100)
    code_name = models.CharField(max_length=100, unique=True)   
    type = models.CharField(max_length=100)
    name_with_type = models.CharField(max_length=100)
    
    def __str__(self) -> str:
        return self.name_with_type
    

class District(models.Model):
    code = models.IntegerField(unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    code_name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    name_with_type = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='districts')
    
    def __str__(self) -> str:
        return self.name_with_type
    

class Ward(models.Model):
    code = models.IntegerField(unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    code_name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    name_with_type = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='wards')
        
    def __str__(self):
        return self.name_with_type
    

class Address(models.Model):
    id = models.AutoField(primary_key=True)
    street = models.CharField(max_length=100, blank= False, null = False)
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    
    
    def __str__(self):
        return f"{self.street}, {self.ward.name_with_type}, {self.district.name_with_type}, {self.province.name_with_type}"
    
    