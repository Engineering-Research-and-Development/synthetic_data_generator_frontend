<script>
    import {Navbar, NavBrand, NavHamburger, NavLi, NavUl} from "flowbite-svelte";
</script>

<Navbar class="fixed w-full bg-opacity-30 top-0 backdrop-blur-lg shadow-md z-50">
    <div class="flex items-center gap-4">
        <NavBrand href="https://www.eng.it">
                <img src="ENG-LOGO-LIGHT.png" class="h-6 sm:h-9" alt="ENG Logo"/>
        </NavBrand>
    </div>

    <NavHamburger />
    <NavUl>
        <NavLi class="text-white" href="/">Home</NavLi>
    </NavUl>
</Navbar>