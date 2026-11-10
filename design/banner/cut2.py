import cv2,numpy as np
im=cv2.imread('iphone16_raw.png'); hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
H,S,V=hsv[...,0],hsv[...,1],hsv[...,2]
# blue/purple background: hue 100-150 (opencv 0-180), with some saturation
blue=((H>=100)&(H<=150)&(S>60)).astype(np.uint8)
# also near-black corners (the rounded nav pill bottom-left) treat as bg if very dark & blue-ish
keep=(1-blue).astype(np.uint8)*255
keep=cv2.medianBlur(keep,5)
# largest connected component = the phone
n,lab,stats,_=cv2.connectedComponentsWithStats((keep>128).astype(np.uint8),8)
big=1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
m=((lab==big)*255).astype(np.uint8)
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
m=cv2.GaussianBlur(m,(0,0),1.2)
# despill: reduce blue on edge pixels
rgb=cv2.cvtColor(im,cv2.COLOR_BGR2RGB).astype(np.float32)
rgba=np.dstack([rgb,m]).astype(np.uint8)
ys,xs=np.where(m>40); pad=4
x0,y0,x1,y1=max(0,xs.min()-pad),max(0,ys.min()-pad),min(im.shape[1],xs.max()+pad),min(im.shape[0],ys.max()+pad)
cv2.imwrite('iphone16_cut.png',cv2.cvtColor(rgba[y0:y1,x0:x1],cv2.COLOR_RGBA2BGRA))
print('saved',x1-x0,y1-y0)
