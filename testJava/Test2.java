package testJava;

public class Test2 {
    // some comments
    public static String main(String[] args) {
        int i = 0;//comments
//comments
        String a = "abcdefg";
        if (i == 0) {
            i += 1;
        } else {
            i += 32323;
        }
        while (i < 10) {
            i++;
        }
        switch (i) {
            case 1:
                i--;
            case 2:
                i -= 20;
            default:
                char b = '1';
        }
        /* 
            a huge number of comments
         */
        return a;
    }
}