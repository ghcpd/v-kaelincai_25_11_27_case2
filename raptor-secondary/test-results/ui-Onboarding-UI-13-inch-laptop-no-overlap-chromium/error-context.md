# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#main"
  - generic [ref=e5]:
    - banner [ref=e6]:
      - heading "Employee Onboarding" [active] [level=1] [ref=e7]
      - generic [ref=e8]:
        - generic [ref=e9]: Toggle theme
        - button "Toggle dark mode" [ref=e10] [cursor=pointer]: Dark mode
    - main [ref=e11]:
      - generic [ref=e12]: "Step 1 of 3: Welcome"
      - generic [ref=e13]:
        - navigation "Onboarding steps" [ref=e14]:
          - list [ref=e15]:
            - listitem [ref=e16]:
              - 'button "Step 1: Welcome" [ref=e17]': Welcome
            - listitem [ref=e18]:
              - 'button "Step 2: Policies" [ref=e19]': Policies
            - listitem [ref=e20]:
              - 'button "Step 3: Handbook" [ref=e21]': Handbook
        - article "Welcome" [ref=e22]:
          - heading "Welcome" [level=2] [ref=e23]
          - paragraph [ref=e24]: Product Manager
          - generic [ref=e25]:
            - heading "Welcome, Jane Doe!" [level=2] [ref=e26]
            - paragraph [ref=e27]: We're excited to have you on board. This wizard will guide you through key onboarding tasks.
    - region "Wizard actions" [ref=e28]:
      - generic [ref=e29]:
        - generic [ref=e30]: Step 1 of 3
        - generic [ref=e31]: Complete all steps to submit
      - generic [ref=e32]:
        - button "Back" [disabled] [ref=e33] [cursor=pointer]
        - button "Next" [ref=e34] [cursor=pointer]
```