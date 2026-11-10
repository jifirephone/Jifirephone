import cv2,numpy as np
im=cv2.imread('iphone16_raw.png'); h,w=im.shape[:2]
mask=np.zeros((h,w),np.uint8); bgd=np.zeros((1,65),np.float64); fgd=np.zeros((1,65),np.float64)
rect=(int(w*0.06),int(h*0.04),int(w*0.9),int(h*0.92))
cv2.grabCut(im,mask,rect,bgd,fgd,6,cv2.GC_INIT_WITH_RECT)
m=np.where((mask==2)|(mask==0),0,1).astype(np.uint8)
m=cv2.medianBlur(m*255,7); m=cv2.GaussianBlur(m,(0,0),1.5)
rgba=np.dstack([cv2.cvtColor(im,cv2.COLOR_BGR2RGB),m])
ys,xs=np.where(m>40); pad=6
x0,y0,x1,y1=max(0,xs.min()-pad),max(0,ys.min()-pad),min(w,xs.max()+pad),min(h,ys.max()+pad)
cv2.imwrite('iphone16_cut.png',cv2.cvtColor(rgba[y0:y1,x0:x1],cv2.COLOR_RGBA2BGRA))
print('saved',x1-x0,y1-y0)
