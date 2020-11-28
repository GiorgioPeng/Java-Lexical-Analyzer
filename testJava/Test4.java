package testJava;

public class Test4 {
    public static String main(String[] args) {
        int i = 2147483649;//here is an error
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
                byte b = 1234;// here is an error
        }
        return a;
    }
}