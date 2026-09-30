<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
 xmlns="http://www.opengis.net/sld" 
 xmlns:ogc="http://www.opengis.net/ogc" 
 xmlns:xlink="http://www.w3.org/1999/xlink" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>default_label</Name>
    <UserStyle>
    <!-- Styles can have names, titles and abstracts -->
      <Title>Default label</Title>
      <Abstract>A default label</Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- A FeatureTypeStyle for rendering points -->
      <FeatureTypeStyle>
        <Rule>
          <Name>rule1</Name>
          <Title>Default label</Title>
          <Abstract>A wrapped composed label</Abstract<TextSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:Function name="Concatenate">
                <ogc:Literal><![CDATA[prefix: ]]></ogc:Literal>
                <ogc:PropertyName>name</ogc:PropertyName>
                <ogc:PropertyName>title</ogc:PropertyName>
                <ogc:Literal><![CDATA[ entity]]></ogc:Literal>
              </ogc:Function>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">12.0</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <Displacement>
                  <DisplacementX>0</DisplacementX>
                  <DisplacementY>5</DisplacementY>
                </Displacement>
                <Rotation>45</Rotation>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>5</Radius>
              <Fill>
                <CssParameter name="fill">#000000</CssParameter>
                <CssParameter name="fill-opacity">1</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#000000</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">50</VendorOption>
          </TextSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>

