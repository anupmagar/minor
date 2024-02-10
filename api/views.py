import jwt, datetime
from django.shortcuts import render
from rest_framework.views import APIView, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import api_view
from .serializers import UserSerializer, ProductSerializer
from django.http import JsonResponse
from .models import User, Product
from rest_framework.parsers import MultiPartParser,FormParser
import tensorflow as tf
from PIL import Image
import numpy as np
import keras
from io import BytesIO
# tf.config.run_functions_eagerly(True)
# img_size = 120

# generator = keras.models.load_model('anup.h5',compile=False)




# Create your views here.
class RegisterView(APIView):
    def post(self,request):
        serializer = UserSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']


        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        
        payload = {
            'id' : user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        #token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response =  Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt' : token
        }
        
        return response
    

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)

        # return Response(token)
    
class LogoutView(APIView):
    def post(self,request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message':'success'
        }
        return response
    

# class ImageView(APIView):
#     parser_classes = (MultiPartParser,FormParser)
#     def post(self, request, *args, **kwargs):
#         # products = Product.objects.all()
#         serializer = ProductSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

# class ColorizeImage(APIView):
#     def get(self,request)
    
# class ImageView(APIView):
#     def post(self, request):
#         if request.FILES.get('image'):
#             uploaded_image = request.FILES['image']
#             uploaded_image_instance = Product(image=uploaded_image)
#             print(uploaded_image_instance)
#             uploaded_image_instance.save()
            
#             # Get the uploaded image
            
#             image_path = uploaded_image_instance.image.path
#             print(image_path)    
#             image = Image.open(image_path) 
#             print(image)
            
#             # Colorize the image
#             colorized_image = self.colorizer(image)
            
#             # Save the colorized image
#             # color_image_instance = Product(colorized_image = colorized_image)
#             # color_image_instance.save()
#             uploaded_image_instance.colorized_image.save('colorized_' + uploaded_image_instance.image.name, colorized_image)
#             uploaded_image_instance.save()
            
#             return JsonResponse({'colorized_image_url': uploaded_image_instance.colorized_image.url})
        
#         return JsonResponse({'error': 'No image provided'}, status=400)
    
#     def colorizer(self,image):
#         a =[]
#         # rgb = Image.open( image ).resize( ( img_size , img_size ) )
#         rgb = image.resize((img_size,img_size))
#         # Normalize the RGB image array

#         gray = rgb.convert( 'L' )
#         # Normalize the grayscale image array
#         gray_array = ( np.asarray( gray).reshape( ( img_size , img_size , 1 ) ) ) / 255
#         # Append both the image arrays
#         a.append( gray_array )
#         d = np.asarray(a)
#         output = generator(d[0:]).numpy()
#         color_output = Image.fromarray((output[0]*255).astype('uint8')).resize((1024,1024))
#         return color_output


class ImageView(APIView):
    def colorize(self, image):
        img_size = 120  # Assuming img_size is defined 
        generator = tf.keras.models.load_model('anup.h5',compile=False)
        a = []

        # Resize the RGB image
        rgb = image.resize((img_size, img_size))

        # Convert to grayscale
        gray = rgb.convert('L')

        # Convert to numpy array, normalize, and reshape grayscale array
        gray_array = np.asarray(gray).reshape(( img_size, img_size, 1)) / 255.0
        a.append(gray_array)
        d= np.asanyarray(a)
        

        # Generate colorized output
        output = generator(d[0:]).numpy()

        # Convert output to image format
        color_output = Image.fromarray((output[0] * 255).astype('uint8')).resize((1024, 1024))

        return color_output

    def post(self, request):
        if request.FILES.get('image'):
            uploaded_image = request.FILES['image']
            uploaded_image_instance = Product(image=uploaded_image)
            uploaded_image_instance.save()

            # Get the uploaded image instance
            image_instance = uploaded_image_instance.image

            # Open the image using PIL
            image = Image.open(uploaded_image)

            # Colorize the image
            colorized_image = self.colorize(image)

            # Save the colorized image
            colorized_image_io = BytesIO()
            colorized_image.save(colorized_image_io, format='JPEG')
            colorized_image_io.seek(0)

            # Update the image field with the colorized image
            uploaded_image_instance.image.save('colorized_' + image_instance.name, colorized_image_io)
            uploaded_image_instance.save()

            # Get the URL of the colorized image
            colorized_image_url = uploaded_image_instance.image.url

            # Serialize the product instance
            serialized_product = ProductSerializer(uploaded_image_instance).data

            return JsonResponse({'colorized_image_url': colorized_image_url})
            

        return JsonResponse({'error': 'No image provided'}, status=400)
