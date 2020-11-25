package testJava;


import java.util.ArrayList;
import java.util.List;

public class Test {
    public Test(){

    }

    public static class A{
        protected String name;
        public A(){
            name = "A";
        }
        public String getName() {
            return name;
        }
    }

    public static class B extends A{
        public String name;
        public B(){
            super();
            name = "B";
        }
        public String getName() {
            return name;
        }
    }

    public static class C extends B{
        public String name;
        public C(){
            super();
            name = "C";
        }
        public String getName() {
            return name;
        }
        public String Test(){return "cc";}
    }


    public static void main(String[] args) {
        List<A> deck = new ArrayList<A>();
        deck.add(new A());
        deck.add(new B());
        deck.add(new C());
        System.out.println(deck.get(0).getName());
        System.out.println(deck.get(1).getName());
        System.out.println(((C)deck.get(2)).Test());




    }
}
