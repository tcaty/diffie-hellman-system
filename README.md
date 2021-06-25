# Diffie-Hellman System
It is my course work on the theme Diffie-Hellman System.
Algorithms used: "from right to left" (modulo fast exponentiation algorithm), "from left to right" (modulo fast exponentiation algorithm), one more modulo fast exponentiation algorithm and "baby step giant step" (to calculate discrete logarithm).

So there are Diffie-Hellman System Members (Alce, Bob) and Hacker (Eve) in Open Channel. The task of the first two is create DH System and send encrypted message, the task of the last is hack the system and decrypt encrypted message.

Nesting scheme of program classes
![dhsys2](https://user-images.githubusercontent.com/79706809/123479110-16c52280-d609-11eb-843e-3b21c0241281.png)


It is very important to choose correct numbers p, g to create DH System, cause in this case Hacker can wrong calculate private system key and he can't decrypt the message.

![image](https://user-images.githubusercontent.com/79706809/123480718-715f7e00-d60b-11eb-99bf-d95555ffdacd.png)


Result

![image](https://user-images.githubusercontent.com/79706809/123480524-25acd480-d60b-11eb-8d8e-b3ee6f8d72aa.png)



If at least one inequality will be false, DH System becomes more vulnerable and Hacker can calculate private system key.

![image](https://user-images.githubusercontent.com/79706809/123481204-11b5a280-d60c-11eb-99d8-07e3e6d7cbea.png)



