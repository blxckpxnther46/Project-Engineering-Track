# Dorm Marketplace PRD

## Scope Cut
- Payments → not needed for MVP
- Chat → adds complexity
- Delivery → not required for in-person exchange

## MVP Features
- List item
- View items
- Claim item

## Acceptance Criteria
Given item is available  
When user clicks claim  
Then item becomes reserved  

Given item is reserved  
When timeout expires  
Then item becomes available  

Given item is sold  
When user views  
Then item is unavailable  
